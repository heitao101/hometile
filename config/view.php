<?php

return [
    'paths' => [
        resource_path('views'),
    ],

    // Do not use realpath(): it returns false when the directory is missing
    // (empty Railway volume mounted over /app/storage).
    'compiled' => env('VIEW_COMPILED_PATH', storage_path('framework/views')),
];
