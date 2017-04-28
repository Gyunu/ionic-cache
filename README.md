##@gyunu/ionic-cache
Import into app.module. 

The routes param is an object of all your routes in the format 'name': 'api endpoint'.  

See the example below

<pre>
CacheModule.forRoot(routes, {
      //in minutes
      expires: 60,
      //in milliseconds
      timeout: 5000,
      retry: 3,
      //the base url of your API i.e "http://myawesome.io/api/v1"
      base: environment.base_url
    })
</pre>

Example routes file
Interpolate with curly braces, you can interpolate any where, including parameters. 

`get` and `post` are required at the front of the name, otherwise you can name them what you like.
<pre>
export const routes = {
  'get.people.index': '/people',
  'get.people.person': '/people/{person}',
  'get.people.param': '/people?id={id}',
  'post.people': '/people'
}
</pre>

Call the Cache/Api Like so, when you've imported them/used dependency injection:
<pre>

this.cache.get('get.people.index')
.subscribe(//yourcode)

this.cache.get('get.people.person', {person: 12})
.subscribe(//yourcode)

.this.cache.get('get.people.param', {id: 19})
.subscribe(//);

this.api.post('post.people', {firstname: 'dave', lastname: 'allen'})
.subscribe(//);

</pre>

Data is cached for however long you set in the config, it uses Native storage and falls back to local storage if not available. 


The api has the same signature as the cache functions.

Cache also has `.flush()` to flush the cache. 

and `set(key, data)` and `clear(key)` should you want to set and remove keys.  

also: `getFromApi(string, params)` which skips the caching layer and calls the api directly. has the same signature as get and post.

Better docs will come
