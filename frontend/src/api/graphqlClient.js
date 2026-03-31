const GQL_URL = 'http://localhost:5000/graphql';

export const gqlRequest = async (query, variables = {}) => {
    const token = localStorage.getItem('token');

    const res = await fetch(GQL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ query, variables }),
    });

    const { data, errors } = await res.json();
    if (errors) throw new Error(errors[0].message);
    return data;
};