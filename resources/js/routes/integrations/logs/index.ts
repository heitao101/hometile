import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\IntegrationController::all
 * @see app/Http/Controllers/IntegrationController.php:92
 * @route '/integrations/logs'
 */
export const all = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: all.url(options),
    method: 'get',
})

all.definition = {
    methods: ["get","head"],
    url: '/integrations/logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\IntegrationController::all
 * @see app/Http/Controllers/IntegrationController.php:92
 * @route '/integrations/logs'
 */
all.url = (options?: RouteQueryOptions) => {
    return all.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\IntegrationController::all
 * @see app/Http/Controllers/IntegrationController.php:92
 * @route '/integrations/logs'
 */
all.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: all.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\IntegrationController::all
 * @see app/Http/Controllers/IntegrationController.php:92
 * @route '/integrations/logs'
 */
all.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: all.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\IntegrationController::all
 * @see app/Http/Controllers/IntegrationController.php:92
 * @route '/integrations/logs'
 */
    const allForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: all.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\IntegrationController::all
 * @see app/Http/Controllers/IntegrationController.php:92
 * @route '/integrations/logs'
 */
        allForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: all.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\IntegrationController::all
 * @see app/Http/Controllers/IntegrationController.php:92
 * @route '/integrations/logs'
 */
        allForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: all.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    all.form = allForm
const logs = {
    all: Object.assign(all, all),
}

export default logs