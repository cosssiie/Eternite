const { gql } = require('graphql-tag');

module.exports = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        role: String!
        isActive: Boolean!
        favourites: [Publication]
    }

    type Publication {
        id: ID!
        title: String!
        description: String
        content: String
        images: [String]
        status: String
        createdAt: String!
        author: User
        category: Category
        attributes: [Attribute]
    }

    type Category {
        id: ID!
        name: String
        isActive: Boolean!
        parent: Category
        children: [Category]
    }

    type CategoryTemplate {
        category: Category
        fields: [TemplateField]
    }

    type TemplateField {
        key: String!
        label: String!
        type: String!
        required: Boolean
        options: [String]
    }

    input FieldInput {
        key: String!
        label: String!
        type: String!
        required: Boolean
        options: [String]
    }

    type Attribute {
        key: String
        label: String
        value: String
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User
        publications(status: String, categoryId: ID): [Publication]
        publication(id: ID!): Publication
        myPublications: [Publication]
        favourites: [Publication]
        categories: [Category]
        categoryTree: [Category]
        category(id: ID!): Category
        categoryTemplate(categoryId: ID!): CategoryTemplate

        # admin
        users: [User]
    }

    type Mutation {
        register(name: String!, email: String!, password: String!): User
        login(email: String!, password: String!): AuthPayload
        updateProfile(name: String, email: String, currentPassword: String, newPassword: String): User
        deleteMe: Boolean
        deletePublication(id: ID!): ID
        toggleFavourite(publicationId: ID!): Boolean
        createCategory(name: String!, parentId: ID): Category
        updateCategory(id: ID!, name: String, parentId: ID): Category
        deleteCategory(id: ID!): Boolean
        toggleCategoryActive(id: ID!): Category
        saveCategoryTemplate(categoryId: ID!, fields: [FieldInput!]!): CategoryTemplate
        
        # admin
        deleteUser(id: ID!): Boolean
        toggleUserStatus(id: ID!): User
    }
`;