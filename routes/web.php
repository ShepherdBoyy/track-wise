<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\InvoiceHistoryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

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

        Route::get("/{hospital_id}/invoices/{invoice_id}/history", [InvoiceHistoryController::class, "index"]);
        Route::post("/{hospital_id}/invoices/{invoice_id}/history/store", [InvoiceHistoryController::class, "store"]);
        Route::delete("/{hospital_id}/invoices/{invoice_id}/history/delete", [InvoiceHistoryController::class, "destroy"]);
    }); 

    Route::prefix("invoices")->group(function () {
        Route::get('/', fn() => redirect('/invoices/Current'));
        Route::get("/{processing_days}", [InvoiceController::class, "index"]);
    });

    Route::prefix("user-management")->group(function () {
        Route::get("/", [UserController::class, "index"]);
        Route::post("/store", [UserController::class, "store"]);
        Route::put("/{user_id}/update", [UserController::class, "update"]);
    });

    Route::post("/logout", [AuthController::class, "destroy"]);
});

