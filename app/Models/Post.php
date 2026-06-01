<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Post extends Model
{
    protected $fillable = [
        'slug',
        'title_fr', 'title_en',
        'excerpt_fr', 'excerpt_en',
        'content_fr', 'content_en',
        'meta_description_fr', 'meta_description_en',
        'cover_image', 'is_published', 'published_at', 'sort_order',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'sort_order'   => 'integer',
    ];

    public static function generateSlug(string $title): string
    {
        $slug = Str::slug($title);
        $count = static::where('slug', 'like', "{$slug}%")->count();

        return $count ? "{$slug}-{$count}" : $slug;
    }

    public function localized(string $field, string $locale = 'fr'): ?string
    {
        $value = $this->{"{$field}_{$locale}"};

        if (is_string($value) && trim($value) !== '') {
            return $value;
        }

        return $this->{"{$field}_fr"};
    }

    public function readingTimeFor(string $locale = 'fr'): int
    {
        $content = $this->localized('content', $locale) ?? '';
        $words = str_word_count(strip_tags($content));

        return max(1, (int) ceil($words / 200));
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image ? asset('storage/' . $this->cover_image) : null;
    }

    /** @deprecated Utiliser readingTimeFor() */
    public function getReadingTimeAttribute(): int
    {
        return $this->readingTimeFor('fr');
    }

    /** Données passées au front (les deux langues + métadonnées communes). */
    public function toPublicPayload(): array
    {
        return [
            'id'                   => $this->id,
            'slug'                 => $this->slug,
            'title_fr'             => $this->title_fr,
            'title_en'             => $this->title_en,
            'excerpt_fr'           => $this->excerpt_fr,
            'excerpt_en'           => $this->excerpt_en,
            'content_fr'           => $this->content_fr,
            'content_en'           => $this->content_en,
            'meta_description_fr'  => $this->meta_description_fr,
            'meta_description_en'  => $this->meta_description_en,
            'cover_image_url'      => $this->cover_image_url,
            'published_at'         => $this->published_at?->toIso8601String(),
            'reading_time_fr'      => $this->readingTimeFor('fr'),
            'reading_time_en'      => $this->readingTimeFor('en'),
        ];
    }

    /** Liste admin / aperçu compact. */
    public function toAdminSummary(): array
    {
        return [
            'id'           => $this->id,
            'title_fr'     => $this->title_fr,
            'title_en'     => $this->title_en,
            'slug'         => $this->slug,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->format('d/m/Y'),
            'created_at'   => $this->created_at->format('d/m/Y'),
        ];
    }
}
