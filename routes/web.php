<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/hospitals');

Route::get('/invoice_page', [InvoiceController::class, 'invoicePage']);

Route::middleware(["guest"])->group(function () {
    Route::get("/login", [AuthController::class, "index"])->name("login");
    Route::post("/login", [AuthController::class, "store"]);
});

Route::middleware(["auth"])->group(function () {
    Route::prefix("hospitals")->group(function () {
        Route::get("/", [HospitalController::class, "index"]);
        Route::post("/create", [HospitalController::class, "store"]);
        Route::put("/edit/{id}", [HospitalController::class, "update"]);
        Route::delete("/delete/{id}", [HospitalController::class, "destroy"]);

        Route::get("/{hospital_id}/invoices/{processing_days}", [HospitalController::class, "show"]);
        Route::get("/{hospital_id}/invoices/create", [HospitalController::class, "createInvoice"]);
        Route::post("/invoices/store", [HospitalController::class, "storeInvoice"]);
        Route::get("/invoices/{id}/edit", [HospitalController::class, "editInvoice"]);
        Route::post("/{hospital_id}/invoices/delete", [HospitalController::class, "deleteInvoice"]);
    }); 

    Route::prefix("invoices")->group(function () {
        Route::get("/{processing_days}", [InvoiceController::class, "index"]);
    });
});

