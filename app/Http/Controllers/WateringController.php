<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWateringRequest;
use App\Http\Resources\WateringResource;
use App\Models\Plant;
use App\Models\Watering;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class WateringController extends Controller
{
    public function store(StoreWateringRequest $request, Plant $plant): JsonResponse
    {
        $watering = $plant->waterings()->create($request->validated());

        return WateringResource::make($watering->fresh())
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function destroy(Watering $watering): Response
    {
        Gate::authorize('view', $watering->plant);

        $watering->delete();

        return response()->noContent();
    }
}
