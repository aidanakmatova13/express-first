// const http = require('http') //в node.js модуль http создает бэкенд
//
// const url = 'localhost'
// const port = 8000
//
// const server = http.createServer((req, res) => {
//     if (req.url === '/users'){
//         res.write('give')
//     }
//     if (req.url === '/catalog'){
//         res.write('отдам весь каталго')
//     }
//     res.end()
// })
//
// server.listen(port, url, () =>{
//     console.log('server is running')
// })

const express = require('express')
const fs = require('fs')
const cors = require('cors')
const {nanoid} = require('nanoid')

const server = express()
server.use(cors())
server.use(express.json())


const getAllUsers = () => JSON.parse(fs.readFileSync('users.json', 'utf8'))

server.get('/api/users', (req, res) => {
    const users = getAllUsers()
    res.json(users)
})

server.get('/api/users/:id', (req, res) => {
    const users = getAllUsers()
    const selectedUser = users.find(el => el.id === +req.params.id) //req.params.id - айди который записывается после :
    if (selectedUser) {
        res.json(selectedUser)
    } else {
        res.status(404).json({status: 'Not found'})
    }
})

server.delete('/api/users/:id', (req, res) => {
    const users = getAllUsers()
    const deletedUser = users.find(el => el.id === +req.params.id)
    const filteredUsers = users.filter(el => el.id !== +req.params.id)
    fs.writeFileSync('users.json', JSON.stringify(filteredUsers, null, 2))
    res.json(deletedUser)
})


server.put('/api/users/:id', (req, res) => {
    const updatedUsers = getAllUsers().map(el => el.id === +req.params.id ? {...el, ...req.body} : el)
    fs.writeFileSync('users.json', JSON.stringify(updatedUsers, null, 2))
    res.json(updatedUsers)
})


server.post('/api/users/:id', (req, res) => {
    // req.body.id = nanoid()
    const newUser = {
        'id': nanoid(),
        ...req.body
    }
    const addUser = [...getAllUsers(), newUser]
    fs.writeFileSync('users.json', JSON.stringify(addUser, null, 2))
    res.json(addUser)
})

// server.post('/api/users/:id', (req, res) => {
//     const users = getAllUsers()
// })

server.listen(8000, () => {
    console.log('Server is running')
})