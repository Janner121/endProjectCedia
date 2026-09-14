<?php

namespace Database\Seeders;

use App\Models\Species;
use Illuminate\Database\Seeder;

class SpeciesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $especies = [
            [
                'nombre_comun' => 'Potos',
                'nombre_cientifico' => 'Epipremnum aureum',
                'frecuencia_riego_dias' => 7,
                'luz' => 'luz_indirecta',
                'cuidados' => 'Dejar secar la superficie del sustrato entre riegos. Tolera poca luz.',
            ],
            [
                'nombre_comun' => 'Lengua de suegra',
                'nombre_cientifico' => 'Dracaena trifasciata',
                'frecuencia_riego_dias' => 14,
                'luz' => 'sombra',
                'cuidados' => 'Muy resistente al exceso de sombra y al olvido. Evitar encharcar la maceta.',
            ],
            [
                'nombre_comun' => 'Echeveria',
                'nombre_cientifico' => 'Echeveria elegans',
                'frecuencia_riego_dias' => 12,
                'luz' => 'sol_directo',
                'cuidados' => 'Suculenta. Sustrato con buen drenaje, regar solo cuando esté completamente seco.',
            ],
            [
                'nombre_comun' => 'Cactus de Navidad',
                'nombre_cientifico' => 'Schlumbergera truncata',
                'frecuencia_riego_dias' => 10,
                'luz' => 'luz_indirecta',
                'cuidados' => 'A diferencia de otros cactus, prefiere humedad moderada y no sol directo.',
            ],
            [
                'nombre_comun' => 'Helecho de Boston',
                'nombre_cientifico' => 'Nephrolepis exaltata',
                'frecuencia_riego_dias' => 3,
                'luz' => 'sombra',
                'cuidados' => 'Requiere sustrato siempre húmedo y ambiente con buena humedad.',
            ],
            [
                'nombre_comun' => 'Costilla de Adán',
                'nombre_cientifico' => 'Monstera deliciosa',
                'frecuencia_riego_dias' => 7,
                'luz' => 'luz_indirecta',
                'cuidados' => 'Evitar sol directo, quema las hojas. Regar cuando la capa superior del sustrato esté seca.',
            ],
            [
                'nombre_comun' => 'Ficus lira',
                'nombre_cientifico' => 'Ficus lyrata',
                'frecuencia_riego_dias' => 7,
                'luz' => 'luz_indirecta',
                'cuidados' => 'Sensible al exceso de riego. Limpiar hojas para favorecer la fotosíntesis.',
            ],
            [
                'nombre_comun' => 'Sábila',
                'nombre_cientifico' => 'Aloe vera',
                'frecuencia_riego_dias' => 14,
                'luz' => 'sol_directo',
                'cuidados' => 'Suculenta medicinal. Muy sensible al exceso de agua, dejar secar por completo.',
            ],
            [
                'nombre_comun' => 'Espatifilo',
                'nombre_cientifico' => 'Spathiphyllum wallisii',
                'frecuencia_riego_dias' => 5,
                'luz' => 'sombra',
                'cuidados' => 'Las hojas caídas avisan cuando necesita agua. No tolera sol directo.',
            ],
            [
                'nombre_comun' => 'Poto plateado',
                'nombre_cientifico' => 'Scindapsus pictus',
                'frecuencia_riego_dias' => 7,
                'luz' => 'luz_indirecta',
                'cuidados' => 'Similar al potos común, prefiere luz indirecta brillante.',
            ],
            [
                'nombre_comun' => 'Albahaca',
                'nombre_cientifico' => 'Ocimum basilicum',
                'frecuencia_riego_dias' => 2,
                'luz' => 'sol_directo',
                'cuidados' => 'Aromática de riego frecuente. Mantener el sustrato húmedo sin encharcar.',
            ],
            [
                'nombre_comun' => 'Lavanda',
                'nombre_cientifico' => 'Lavandula angustifolia',
                'frecuencia_riego_dias' => 6,
                'luz' => 'sol_directo',
                'cuidados' => 'Prefiere sustrato seco entre riegos y buena ventilación.',
            ],
            [
                'nombre_comun' => 'Orquídea',
                'nombre_cientifico' => 'Phalaenopsis amabilis',
                'frecuencia_riego_dias' => 7,
                'luz' => 'luz_indirecta',
                'cuidados' => 'Regar por inmersión breve. Nunca dejar agua estancada en la base.',
            ],
            [
                'nombre_comun' => 'Cinta',
                'nombre_cientifico' => 'Chlorophytum comosum',
                'frecuencia_riego_dias' => 5,
                'luz' => 'luz_indirecta',
                'cuidados' => 'Muy resistente, ideal para interiores con poca luz.',
            ],
            [
                'nombre_comun' => 'Palma areca',
                'nombre_cientifico' => 'Dypsis lutescens',
                'frecuencia_riego_dias' => 5,
                'luz' => 'luz_indirecta',
                'cuidados' => 'Mantener el sustrato ligeramente húmedo. Sensible al agua con mucho cloro.',
            ],
        ];

        foreach ($especies as $especie) {
            Species::create($especie);
        }
    }
}
