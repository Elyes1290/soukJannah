<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\ReturnDecisionMail;
use App\Models\ReturnRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ReturnController extends Controller
{
    public function index()
    {
        $returns = ReturnRequest::with(['order', 'customer'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id'           => $r->id,
                'order_number' => $r->order->number,
                'order_id'     => $r->order_id,
                'customer'     => $r->customer->full_name,
                'customer_email' => $r->customer->email,
                'reason'       => $r->reason,
                'message'      => $r->message,
                'status'       => $r->status,
                'admin_notes'  => $r->admin_notes,
                'created_at'   => $r->created_at->format('d/m/Y H:i'),
            ]);

        $counts = [
            'pending'  => ReturnRequest::where('status', 'pending')->count(),
            'approved' => ReturnRequest::where('status', 'approved')->count(),
            'rejected' => ReturnRequest::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Returns/Index', [
            'returns' => $returns,
            'counts'  => $counts,
        ]);
    }

    public function decide(Request $request, ReturnRequest $return)
    {
        $data = $request->validate([
            'decision'    => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $return->update([
            'status'      => $data['decision'],
            'admin_notes' => $data['admin_notes'] ?? null,
        ]);

        $return->load('order', 'customer');

        // Email au client
        if ($return->customer?->email) {
            Mail::to($return->customer->email)->send(new ReturnDecisionMail($return));
        }

        $label = $data['decision'] === 'approved' ? 'approuvée' : 'refusée';

        return back()->with('success', "Demande de retour {$label} — email envoyé au client.");
    }
}
