<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $connection = "mysql";

    protected $fillable = [
        "name",
        "slug",
        "domain",
        "database",
        "address_line1",
        "address_line2",
        "logo_path",
        "favicon_path",
        "color_one",
        "color_two",
        "color_three",
        "color_four",
        "color_five",
    ];

    public function theme(): array
    {
        return [
            "colorOne" => $this->color_one,
            "colorTwo" => $this->color_two,
            "colorThree" => $this->color_three,
            "colorFour" => $this->color_four,
            "colorFive" => $this->color_five,
        ];
    }
}