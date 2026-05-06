<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'customer_id', 'order_id', 'product_id',
        'author', 'location', 'rating',
        'content', 'is_active', 'is_approved', 'sort_order', 'verified_purchase',
    ];

    protected $casts = [
        'is_active'         => 'boolean',
        'is_approved'       => 'boolean',
        'verified_purchase' => 'boolean',
        'rating'            => 'integer',
        'sort_order'        => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
