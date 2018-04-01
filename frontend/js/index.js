(function () {

    const peopleTemplate = _.template(`
    <% _.each(people, (p) => { %>
    <tr>
    <td><img height=135 src="<%- p.img %>"></img></td>
    <td><%- p.name %></td>
    </tr>
    <% }) %>`);

    Lib.azure.getPeople().done((people) => {
        console.log(people);
        document.getElementById('auth-user-container').innerHTML =
            peopleTemplate({ people: people });
    });
})();