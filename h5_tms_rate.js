/**
 * This module exposes a function that will assist in queuing a scheduled script
 * or a map/reduce script.
 *
 * @NApiVersion 2.1
 */
define(['N/record', 'N/search', 'N/task'],
    /**
     * @param{record} record
     * @param{search} search
     */
    (record, search, task) => {
        const obj = {}
        /**
         * This function launches a map/reduce OR a scheduled script.
         *
         * @param paramScriptId
         * @param paramParameters
         * @param isScheduledScript
         * @returns {*}
         */
        const launchRate = () => {
            log.debug({
                title:"HERE",
                details: "HERE"
            })

            return "IT WORKED!"
        }

        return {launchRate}

    });

