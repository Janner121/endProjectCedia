<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlantRequest;
use App\Http\Requests\UpdatePlantRequest;
use App\Http\Resources\PlantResource;
use App\Models\Plant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class PlantController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $plants = Plant::delUsuario($request->user())
            ->with(['species', 'ultimoRiego'])
            ->when(
                $request->filled('ubicacion'),
                fn ($query) => $query->where('ubicacion', $request->string('ubicacion'))
            )
            ->when(
                $request->filled('species_id'),
                fn ($query) => $query->where('species_id', $request->integer('species_id'))
            )
            ->get();

        if ($request->filled('estado')) {
            $estado = $request->string('estado')->toString();
            $plants = $plants->filter(fn (Plant $plant) => $plant->estado === $estado)->values();
        }

        if ($request->string('sort')->toString() === 'proximo_riego') {
            $plants = $plants->sort(function (Plant $a, Plant $b) {
                return match (true) {
                    $a->proximo_riego === null && $b->proximo_riego === null => 0,
                    $a->proximo_riego === null => -1,
                    $b->proximo_riego === null => 1,
                    default => $a->proximo_riego <=> $b->proximo_riego,
                };
            })->values();
        }

        return PlantResource::collection($plants);
    }

    public function store(StorePlantRequest $request): JsonResponse
    {
        $plant = $request->user()->plants()->create($request->validated());
        $plant = $plant->fresh(['species', 'ultimoRiego']);

        return PlantResource::make($plant)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Plant $plant): PlantResource
    {
        Gate::authorize('view', $plant);

        return PlantResource::make(
            $plant->load(['species', 'waterings' => fn ($query) => $query->orderByDesc('fecha')])
        );
    }

    public function update(UpdatePlantRequest $request, Plant $plant): PlantResource
    {
        $plant->update($request->validated());

        return PlantResource::make($plant->load(['species', 'ultimoRiego']));
    }

    public function destroy(Plant $plant): Response
    {
        Gate::authorize('delete', $plant);

        $plant->delete();

        return response()->noContent();
    }
}
