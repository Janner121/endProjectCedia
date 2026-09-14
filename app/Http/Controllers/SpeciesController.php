<?php

namespace App\Http\Controllers;

use App\Http\Resources\SpeciesResource;
use App\Models\Species;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SpeciesController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return SpeciesResource::collection(
            Species::orderBy('nombre_comun')->get()
        );
    }
}
