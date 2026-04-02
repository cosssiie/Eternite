import { gqlRequest } from './graphqlClient';

export const categoryGql = {
    getAll: () => gqlRequest(`
        query {
            categories {
                id name isActive
                parent { id name }
            }
        }
    `),

    getTree: () => gqlRequest(`
        query {
            categoryTree {
                id name isActive
                children {
                    id name isActive
                    parent { id name }
                }
            }
        }
    `),

    getById: (id) => gqlRequest(`
        query {
            category(id: "${id}") {
                id name isActive
                parent { id name }
            }
        }
    `),

    getTemplate: (id) => gqlRequest(`
        query {
            categoryTemplate(categoryId: "${id}") {
                fields {
                    key label type required options
                }
            }
        }
    `),

    // admin
    create: (name, parentId) => gqlRequest(`
        mutation CreateCategory($name: String!, $parentId: ID) {
            createCategory(name: $name, parentId: $parentId) {
                id name isActive
            }
        }
    `, { name, parentId }),

    update: (id, name, parentId) => gqlRequest(`
        mutation UpdateCategory($id: ID!, $name: String, $parentId: ID) {
            updateCategory(id: $id, name: $name, parentId: $parentId) {
                id name isActive
            }
        }
    `, { id, name, parentId }),

    remove: (id) => gqlRequest(`
        mutation { deleteCategory(id: "${id}") }
    `),

    toggleActive: (id) => gqlRequest(`
        mutation { toggleCategoryActive(id: "${id}") { id name isActive } }
    `),

    saveTemplate: (categoryId, fields) => gqlRequest(`
        mutation SaveTemplate($categoryId: ID!, $fields: [FieldInput!]!) {
            saveCategoryTemplate(categoryId: $categoryId, fields: $fields) {
                category { id name }
                fields { key label type required options }
            }
        }
    `, { categoryId, fields }),
};