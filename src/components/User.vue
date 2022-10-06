<template>
    <div class = "container">
        <h1 class="text-center">Users List</h1>
        <table class = "table table-striped">
            <thead>
                <th> User ID </th>
                <th> First name </th>
                <th> Last name </th>
            </thead>
            <tbody>
                <tr v-for = "user in users" v-bind:key = "user.id">
                    <td>  {{ user.id }} </td>
                    <td>  {{ user.firstName }} </td>
                    <td>  {{ user.lastName }} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import UserService from '../services/user.service'
    export default {
        name: 'Users',
        data(){
            return {
                users : []
            }
        },
        methods: {
            getUsers(){
                UserService.getUsers().then((response) => {
                    this.users = response.data;
                });
            }

        },
        created(){
            this.getUsers()
        }
    }
</script>

