<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeaturedOffer extends Model
{
    protected $fillable = [
        'title', 'description', 'items',
        'price', 'original_price',
        'image', 'url', 'sort_order', 'is_active',
    ];

    protected $casts = [
        'is_active'   => 'boolean',
        'sort_order'  => 'integer',
    ];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function getItemsListAttribute(): array
    {
        if (!$this->items) return [];
        return array_filter(array_map('trim', explode("\n", $this->items)));
    }
}
