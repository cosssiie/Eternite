import { gqlRequest } from './graphqlClient';

export const userGql = {
    me: () => gqlRequest(`query { me { id name email role } }`),

    login: (email, password) => gqlRequest(`
        mutation {
            login(email: "${email}", password: "${password}") {
                token
                user { id name email role }
            }
        }
    `),

    register: (name, email, password) => gqlRequest(`
        mutation {
            register(name: "${name}", email: "${email}", password: "${password}") {
                id name email
            }
        }
    `),

    updateProfile: (data) => gqlRequest(`
        mutation UpdateProfile($name: String, $email: String, $currentPassword: String, $newPassword: String) {
            updateProfile(name: $name, email: $email, currentPassword: $currentPassword, newPassword: $newPassword) {
                id name email
            }
        }
    `, data),

    deleteMe: () => gqlRequest(`mutation { deleteMe }`),

    toggleFavourite: (publicationId) => gqlRequest(`
        mutation { toggleFavourite(publicationId: "${publicationId}") }
    `),

    getFavourites: () => gqlRequest(`
        query {
            favourites {
                id title description images status
                category { id name }
            }
        }
    `),

    // admin
    getAllUsers: () => gqlRequest(`
        query { users { id name email role isActive } }
    `),

    deleteUser: (id) => gqlRequest(`
        mutation { deleteUser(id: "${id}") }
    `),

    toggleUserStatus: (id) => gqlRequest(`
        mutation { toggleUserStatus(id: "${id}") { id name isActive } }
    `),
};