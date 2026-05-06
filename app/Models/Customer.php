<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone',
        'address', 'address2', 'city', 'postal_code', 'country',
        'password', 'remember_token', 'email_verified_at', 'email_verification_token',
        'cart_snapshot', 'cart_updated_at', 'abandoned_cart_sent_at',
    ];

    protected $hidden = ['password', 'remember_token', 'email_verification_token'];

    protected $casts = [
        'email_verified_at'       => 'datetime',
        'cart_updated_at'         => 'datetime',
        'abandoned_cart_sent_at'  => 'datetime',
        'cart_snapshot'           => 'array',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(CustomerAddress::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function socialAccounts(): HasMany
    {
        return $this->hasMany(CustomerSocialAccount::class);
    }

    public function hasPassword(): bool
    {
        return !is_null($this->password);
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function hasAccount(): bool
    {
        return !is_null($this->password);
    }

    public function isVerified(): bool
    {
        return !is_null($this->email_verified_at);
    }
}
