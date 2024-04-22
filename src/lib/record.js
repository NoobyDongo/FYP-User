
export async function search({ table, body, success, error, simple = false, ...others }) {
    const url = `http://localhost:8080/${table}/search${simple ? "/simple" : ""}`
    console.log(url)
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        ...others,
    })
        .then(response => response.json())
        .then(data => {
            //console.log('Success:', data);
            success?.(data)
        })
        .catch((err) => {
            //console.error('Error:', err);
            error?.(err)
        });

}

export async function searchForFilters({ table, filters, page = 0, size = 1, success, error, simple = false, options, ...others }) {
    let request = {
        criteriaList: filters?.map((param) => {
            if (param.key && param.value)
                return ({
                    filterKey: param.key,
                    value: param.value,
                    operation: param.operation || "eq",
                    dataOption: param.option || "all"
                })
            else
                return null
        }).filter(item => item !== null), page, size, ...others
    }
    search({ table, body: request, success, error, simple, ...options })
}


export async function searchForOneFilter({ table, key, value, operation = 'eq', page = 0, size = 1, success, error, options, simple = false, ...others }) {
    let request = {
        criteriaList: [
            {
                filterKey: key,
                value: value,
                operation: operation,
                dataOption: "all"
            }
        ], page, size, ...others
    }
    search({ table, body: request, success, error, simple, ...options })
}

export async function create({ table, body, success, error }) {
    const url = `http://localhost:8080/${table}/add`
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            success?.(data)
        })
        .catch((err) => {
            console.error('Error:', err);
            error?.(err)
        });
}