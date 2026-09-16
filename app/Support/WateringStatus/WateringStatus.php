<?php

namespace App\Support\WateringStatus;

use Carbon\CarbonInterface;

final readonly class WateringStatus
{
    public function __construct(
        public ?CarbonInterface $proximoRiego,
        public string $estado,
    ) {}
}
