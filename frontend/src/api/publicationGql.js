import { gqlRequest } from './graphqlClient';

export const publicationGql = {
    getAll: (status, categoryId) => gqlRequest(`
        query GetPublications($status: String, $categoryId: ID) {
            publications(status: $status, categoryId: $categoryId) {
                id title description images status
                author { id name }
                category { id name }
                attributes { key label value }
            }
        }
    `, { status, categoryId }),

    getById: (id) => gqlRequest(`
        query {
            publication(id: "${id}") {
                id title description content images status
                author { id name }
                category { id name }
                attributes { key label value }
            }
        }
    `),

    myPublications: () => gqlRequest(`
        query {
            myPublications {
                id title description images status
                category { id name }
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