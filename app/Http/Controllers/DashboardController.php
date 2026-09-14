<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlantResource;
use App\Models\Plant;
use App\Models\Watering;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $plants = Plant::delUsuario($user)->with(['species', 'ultimoRiego'])->get();

        $pendientesHoy = $plants->filter(fn (Plant $plant) => $plant->estado === 'hoy')->values();
        $atrasadas = $plants->filter(fn (Plant $plant) => $plant->estado === 'atrasada')->values();

        $riegosUltimos7Dias = Watering::whereHas(
            'plant',
            fn ($query) => $query->delUsuario($user)
        )->where('fecha', '>=', now()->subDays(7)->toDateString())->count();

        return response()->json([
            'pendientes_hoy' => PlantResource::collection($pendientesHoy),
            'atrasadas' => PlantResource::collection($atrasadas),
            'riegos_ultimos_7_dias' => $riegosUltimos7Dias,
            'total_por_ubicacion' => $plants->countBy('ubicacion'),
        ]);
    }
}
