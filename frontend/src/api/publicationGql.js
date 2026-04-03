import { gqlRequest } from './graphqlClient';

export const publicationGql = {
    getAll: (status, categoryId, page = 1, limit = 12, search, attrs) => {
        console.log('publicationGql.getAll called with:', { status, categoryId, page, limit, search, attrs }); // ← добавь

        return gqlRequest(`
    query GetPublications($status: String, $categoryId: ID, $page: Int, $limit: Int, $search: String, $attrs: String) {
        publications(status: $status, categoryId: $categoryId, page: $page, limit: $limit, search: $search, attrs: $attrs) {
            items {
                id title description images status createdAt
                author { id name }
                category { id name }
                attributes { key label value }
            }
            total
        }
    }
    `, { status, categoryId, page, limit, search, attrs });
    },

    getById: (id) => gqlRequest(`
    query GetPublication($id: ID!) {
        publication(id: $id) {
            id title description content images status createdAt
            author {
                id
                name
            }
            category {
                id
                name
            }
            attributes {
                key
                label
                value
            }
        }
    }
    `, { id }),

    myPublications: () => gqlRequest(`
        query {
            myPublications {
            id
            title
            description
            content
            images
            status
            author { name }
            }
        }
    `),

    create: null,
    update: null,

    remove: (id) => gqlRequest(`
        mutation { deletePublication(id: "${id}") }
    `),

    // admin
    approve: (id) => gqlRequest(`
        mutation { approvePublication(id: "${id}") { id status } }
    `),

    reject: (id, reason) => gqlRequest(`
        mutation RejectPublication($id: ID!, $reason: String) {
            rejectPublication(id: $id, reason: $reason) { id status }
        }
    `, { id, reason }),

    toggleActive: (id) => gqlRequest(`
        mutation { togglePublicationActive(id: "${id}") { id status } }
    `),
};