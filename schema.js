const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = require("graphql")
const axios = require("axios").default;

// Customer Type
const CustomerType = new GraphQLObjectType({
    name: "Customer",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
    })
})

// Task Type
const TaskType = new GraphQLObjectType({
    name: "Task",
    fields: () => ({
        id: { type: GraphQLString },
        text: { type: GraphQLString },
        day: { type: GraphQLString },
        reminder: { type: GraphQLBoolean },
    })
})

// root query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parentValue, args){
                return axios.get(`http://localhost:5002/customers/${args.id}`).then(res => {
                    return res.data
                })
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:5002/customers`).then(res => {
                    return res.data
                })
            }
        },
        task: {
            type: TaskType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parentValue, args){
                return axios.get(`http://localhost:5002/tasks/${args.id}`).then(res => {
                    return res.data
                })
            }
        },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parentValue, args){
                return axios.get(`http://localhost:5002/tasks`).then(res => {
                    return res.data
                })
            }
        }
    }
});


// MUTATIONS
const mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        addCustomer: {
            type: CustomerType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:5002/customers', { 
                    name: args.name,
                    email: args.email,
                    age: args.age
                }).then(res => res.data)
            }
        },
        deleteCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args){
                return axios.delete(`http://localhost:5002/customers/${args.id}`).then(res => res.data)
            }
        },
        editCustomer: {
            type: CustomerType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parentValue, args){
                return axios.patch(`http://localhost:5002/customers/${args.id}`, args)
                .then(res => res.data)
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})