<?php

use App\Http\Controllers\HospitalController;
use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/hospitals');

Route::prefix("hospitals")->group(function () {
    Route::get("/", [HospitalController::class, "index"]);
    Route::post("/create", [HospitalController::class, "store"]);
    Route::put("/edit/{id}", [HospitalController::class, "update"]);
});

Route::prefix("invoices")->group(function () {
    Route::get("/", [InvoiceController::class, "index"]);
});