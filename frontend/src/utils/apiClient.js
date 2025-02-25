import axios from 'axios';

const BASE_URL = 'http://localhost:8081';
const GRAPHQL_URL = `${BASE_URL}/graphql`;

class ApiClient {
    constructor(useGraphQL = false) {
        this.useGraphQL = useGraphQL;
        this.token = localStorage.getItem('token');
        
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` })
            }
        });
    }

    // User APIs
    async getUser(id) {
        if (this.useGraphQL) {
            const query = `
                query GetUser($id: ID!) {
                    user(id: $id) {
                        id
                        username
                        email
                        firstName
                        lastName
                        role
                    }
                }
            `;
            return this.graphqlRequest(query, { id });
        }
        return this.axiosInstance.get(`/api/users/${id}`);
    }

    async getUserCheckIns(userId) {
        if (this.useGraphQL) {
            const query = `
                query GetUserCheckIns($userId: ID!) {
                    checkInsByUser(userId: $userId) {
                        id
                        timestamp
                        status
                        location {
                            name
                            address
                        }
                    }
                }
            `;
            return this.graphqlRequest(query, { userId });
        }
        return this.axiosInstance.get(`/api/check-ins/user/${userId}`);
    }

    async createCheckIn(checkInData) {
        if (this.useGraphQL) {
            const mutation = `
                mutation CreateCheckIn($input: CheckInInput!) {
                    createCheckIn(input: $input) {
                        id
                        timestamp
                        status
                    }
                }
            `;
            return this.graphqlRequest(mutation, { input: checkInData });
        }
        return this.axiosInstance.post('/api/check-ins', checkInData);
    }

    // Helper method for GraphQL requests
    async graphqlRequest(query, variables = {}) {
        try {
            const response = await this.axiosInstance.post(GRAPHQL_URL, {
                query,
                variables
            });
            
            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }
            
            return response.data.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Method to switch between REST and GraphQL
    setUseGraphQL(useGraphQL) {
        this.useGraphQL = useGraphQL;
    }
}

// Create a singleton instance
const apiClient = new ApiClient();
export default apiClient;
