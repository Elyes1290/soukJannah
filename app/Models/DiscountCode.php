<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountCode extends Model
{
    protected $fillable = [
        'code', 'type', 'value',
        'min_amount', 'max_uses', 'used_count',
        'is_active', 'expires_at',
    ];

    protected $casts = [
        'value'      => 'decimal:2',
        'min_amount' => 'decimal:2',
        'is_active'  => 'boolean',
        'expires_at' => 'datetime',
    ];

    /** Vérifie si le code est utilisable pour un montant donné */
    public function isValid(float $subtotal): bool
    {
        if (!$this->is_active) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;
        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) return false;
        if ($subtotal < $this->min_amount) return false;
        return true;
    }

    /** Calcule le montant de réduction pour un sous-total donné */
    public function discountAmount(float $subtotal): float
    {
        if ($this->type === 'percent') {
            return round($subtotal * $this->value / 100, 2);
        }
        return min((float) $this->value, $subtotal);
    }
}
