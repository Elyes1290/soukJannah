<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'customer_id', 'number', 'status', 'subtotal', 'shipping', 'total',
        'stripe_session_id', 'stripe_payment_intent', 'locale', 'tracking_number', 'notes',
        'refunded_amount', 'refund_reason', 'disputed_at',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function returnRequest(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(ReturnRequest::class);
    }

    public static function generateNumber(): string
    {
        return 'CMD-' . strtoupper(substr(uniqid(), -6));
    }
}
