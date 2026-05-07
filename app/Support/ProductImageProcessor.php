<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class ProductImageProcessor
{
    private const MAX_WIDTH = 1920;

    private const JPEG_QUALITY = 82;

    /**
     * Redimensionne (largeur max) et réencode les images pour limiter le poids.
     * Fallback : fichier brut si GD indisponible ou format non supporté.
     */
    public static function store(UploadedFile $file, string $directory = 'products', string $disk = 'public'): string
    {
        if (! extension_loaded('gd')) {
            return $file->store($directory, $disk);
        }

        $mime = (string) $file->getMimeType();
        $srcPath = $file->getRealPath();
        if (! $srcPath || ! is_readable($srcPath)) {
            return $file->store($directory, $disk);
        }

        $im = self::createImage($srcPath, $mime);
        if (! $im) {
            return $file->store($directory, $disk);
        }

        $w = imagesx($im);
        $h = imagesy($im);
        if ($w < 1 || $h < 1) {
            imagedestroy($im);

            return $file->store($directory, $disk);
        }

        $scale = $w > self::MAX_WIDTH ? self::MAX_WIDTH / $w : 1.0;
        $nw = max(1, (int) round($w * $scale));
        $nh = max(1, (int) round($h * $scale));

        $dst = imagecreatetruecolor($nw, $nh);
        $isPng = str_contains($mime, 'png');
        if ($isPng) {
            imagealphablending($dst, false);
            imagesavealpha($dst, true);
            $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
            imagefilledrectangle($dst, 0, 0, $nw, $nh, $transparent);
        }

        imagecopyresampled($dst, $im, 0, 0, 0, 0, $nw, $nh, $w, $h);
        imagedestroy($im);

        $filename = $directory.'/'.Str::uuid()->toString().($isPng ? '.png' : '.jpg');
        Storage::disk($disk)->makeDirectory($directory);
        $fullPath = Storage::disk($disk)->path($filename);

        if ($isPng) {
            imagepng($dst, $fullPath, 6);
        } else {
            imagejpeg($dst, $fullPath, self::JPEG_QUALITY);
        }
        imagedestroy($dst);

        return $filename;
    }

    /** @return \GdImage|resource|false */
    private static function createImage(string $path, string $mime)
    {
        return match (true) {
            str_contains($mime, 'jpeg'), str_contains($mime, 'jpg') => @imagecreatefromjpeg($path),
            str_contains($mime, 'png') => @imagecreatefrompng($path),
            str_contains($mime, 'webp') && function_exists('imagecreatefromwebp') => @imagecreatefromwebp($path),
            default => false,
        };
    }
}
