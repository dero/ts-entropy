# TS Entropy: Make sense of your data

Custom utility that helps you to validate and transform complex data structures in TypeScript.

It was used on a project with very complex GraphQL schemas that required to be chiefly simplified
and strongly typed to allow template code engineers to be able to manipulate the data with confidence.

```js
entropy(untypedData)
  .assign(
    // Define the key for the resulting data
    'first_name',

    // Try to perform a transformation on the input data, it may fail
    data => data.name.split(' ')[0],

    // If it succeeds, assign the result to `data.first_name`
    first_name => first_name,

    // If it fails, assign a fallback value to `data.first_name`
    __error => 'stranger'
  )
  .assign(
    'company',
    data => data.company,
    company => `${company.name} (${company.country})`,
    __error => 'Unknown Company'
  )
  .render(data => {
    // `data` is now strongly typed as `{ first_name: string, company: string }`,
    // because the pipeline has successfully extracted the return types from the `assign` calls,
    // both in the success and fallback branches.

    // Logs `Hello, stranger from ACME (USA)`
    console.log(`Hello, ${data.first_name} from ${data.company}`);
  });
```
