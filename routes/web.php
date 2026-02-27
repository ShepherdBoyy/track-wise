<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UpdatesController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\ImportDataController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/updates');

Route::middleware(["guest"])->group(function () {
    Route::get("/login", [AuthController::class, "index"])->name("login");
    Route::post("/login", [AuthController::class, "store"]);
});

Route::middleware(["auth"])->group(function () {
    Route::get('/', [HomeController::class, "index"]);

    Route::get("/updates", [UpdatesController::class, "index"]);

    Route::prefix("hospitals")
        ->middleware(["permission:view_all_hospitals,view_area_hospitals"])
        ->group(function () {
                Route::get("/", [HospitalController::class, "index"]);
                Route::post("/create", [HospitalController::class, "store"]);
                Route::put("/edit/{id}", [HospitalController::class, "update"]);
                Route::delete("/delete/{id}", [HospitalController::class, "destroy"]);

                Route::prefix("{hospital_id}/invoices")
                    ->middleware(["permission:view_invoices"])
                    ->group(function () {
                        Route::get("/", [InvoiceController::class, "index"]);
                        Route::post("/store", [InvoiceController::class, "store"]);
                        Route::put("/{invoice_id}/update", [InvoiceController::class, "update"]);
                        Route::post("/delete", [InvoiceController::class, "destroy"]);

                        Route::post("/update-history", [InvoiceController::class, "bulkUpdateHistory"]);
                        Route::get("/{invoice_id}/view-history", [InvoiceController::class, "viewPdf"]);
                });
    }); 

    Route::prefix("user-management")
        ->middleware(["permission:view_users"])
        ->group(function () {
                Route::get("/", [UserController::class, "index"]);
                Route::post("/store", [UserController::class, "store"]);
                Route::put("/{user_id}/update", [UserController::class, "update"]);
                Route::delete("/{user_id}/delete", [UserController::class, "destroy"]);
    });

    Route::prefix("import-data")
        ->middleware(["permission:view_import_data"])
        ->group(function () {
                Route::get("/", [ImportDataController::class, "index"]);
                Route::get("/download-template", [ImportDataController::class, "downloadTemplate"]);
                Route::post("/store", [ImportDataController::class, "store"]);
    });

    Route::put("/profile-details/{user_id}", [AuthController::class, "update"]);

    Route::post("/logout", [AuthController::class, "destroy"]);
});

