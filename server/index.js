const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
// The data below is mocked.
const data = require("./data");

// The schema should model the full data object available.
const schema = buildSchema(`
  type Pokemon {
    id: String
    name: String!
    classification: String
    types: [String]
    resistant: [String]
    weaknesses: [String]
    weight: Weight
    height: Height
    fleeRate: Float
    evolutionRequirements: EvolutionRequirements
    evolutions: Evolutions
    maxCP: Int 
    maxHP: Int
    attacks: Attacks
  }

  type Attacks {
    fast: [Fast]
    special: [Special]
  }

  input AttacksInput {
    fast: [FastInput]
    special: [SpecialInput]
  }

  input SpecialInput {
    name: String
    type: String
    damage: Int
  }

  input FastInput {
    name: String
    type: String
    damage: Int
  }
  
  type Fast {
    name: String
    type: String
    damage: Int
  }
  
  type Special {
    name: String
    type: String
    damage: Int
  }

  type Weight {
    minimum: String
    maximum: String
  }

  input HeightInput {
    minimum: String
    maximum: String
  }

  type Height {
    minimum: String
    maximum: String
  }

  input WeightInput {
    minimum: String
    maximum: String
  }
  
  type EvolutionRequirements {
    amount: Int
    name: String
  }

  input EvolutionRequirementsInput {
    amount: Int
    name: String
  }

  type Evolutions {
    id: Int
    name: String
  }

  input EvolutionsInput {
    id: Int
    name: String
  }

  input PokemonInput {
    id: String
    name: String!
    classification: String
    types: [String]
    resistant: [String]
    weaknesses: [String]
    weight: WeightInput
    height: HeightInput
    fleeRate: Float
    evolutionRequirements: EvolutionRequirementsInput
    evolutions: EvolutionsInput
    maxCP: Int 
    maxHP: Int
    attacks: AttacksInput
  }

 input TypeInput {
   type: String
 }

 input AttackInput {
   fast: FastInput
   special: SpecialInput
 }

 input SpecialInput {
   name: String
   type: String
   damage: Int
 }

 input FastInput {
   name: String
   type: String
   damage: Int
 }

  type Query {
    Pokemons: [Pokemon]
    Pokemon(name: String, id: String): Pokemon
    Attacks: Attacks
    Attack(type: String): [Pokemon]
    Types: [String]
    Type(name: String): [Pokemon]
  }

  type Mutation {
    createPokemon(input: PokemonInput): Pokemon
    modifyPokemon(name: String, input: PokemonInput): Pokemon
    removePokemon(name: String, id: String): Pokemon
    createType(type: String): [String]
    deleteType(type: String): [String]
    modifyType(type: String, input: String): [String]
    createAttack(input: AttacksInput): Attacks
    deleteAttack(name: String): Attacks
    modifyAttack(name: String, input: FastInput, input: SpecialInput): Attacks
  }
`);

// The root provides the resolver functions for each type of query or mutation.
const root = {
  Pokemons: () => {
    return data.pokemon;
  },
  Pokemon: (request) => {
    return data.pokemon.find(
      (pokemon) => pokemon.name === request.name || pokemon.id === request.id
    );
  },
  Attack: (request) => {
    const result = [];
    data.pokemon.forEach((pokemon) => {
      for (let atk in pokemon.attacks) {
        for (let fast of pokemon.attacks[atk]) {
          if (fast.name === request.type) {
            result.push(pokemon);
          }
        }
      }
    });
    return result;
  },
  Types: () => {
    return data.types;
  },
  Type: (request) => {
    return data.pokemon.filter((pokemon) =>
      pokemon.types.includes(request.name)
    );
  },
  Attacks: () => {
    return data.attacks;
  },
  createPokemon: (request) => {
    const newPokemon = request.input;
    data.pokemon.push(newPokemon);
    return newPokemon;
  },
  modifyPokemon: (request) => {
    const targetPokemon = data.pokemon.find(
      (pokemon) => pokemon.name === request.name
    );
    Object.assign(targetPokemon, request.input);
    return targetPokemon;
  },
  removePokemon: (request) => {
    for (let i = 0; i < data.pokemon.length; i++) {
      if (
        request.name === data.pokemon[i].name ||
        request.id === data.pokemon[i].id
      ) {
        data.pokemon.splice(i, 1);
      }
    }
  },
  createType: (request) => {
    data.types.push(request.type);
    return data.types;
  },
  deleteType: (request) => {
    for (let i = 0; i < data.types.length; i++) {
      if (request.type === data.types[i]) {
        data.types.splice(i, 1);
      }
    }
    return data.types;
  },

  modifyType: (request) => {
    for (let i = 0; i < data.types.length; i++) {
      if (data.types[i] === request.type) {
        data.types[i] = request.input;
      }
    }
    return data.types;
  },

  createAttack: (request) => {
    const attackType = Object.keys(request.input)[0];
    for (const attack of data.attacks[attackType]) {
      if (attack.name === request.input[attackType].name) return;
    }
    data.attacks[attackType].push(request.input[attackType]);
    return data.attacks;
  },
  modifyAttack: (request) => {
    for (const type in data.attacks) {
      for (const attack of data.attacks[type]) {
        if (attack.name === request.name) {
          Object.assign(attack, request.input);
        }
      }
    }
    return data.attacks;
  },

  deleteAttack: (request) => {
    for (const type in data.attacks) {
      for (const attack of data.attacks[type]) {
        if (attack.name === request.name) {
          const index = data.attacks[type].indexOf(attack);
          data.attacks[type].splice(index, 1);
        }
      }
    }
    return data.attacks;
  },
};

// Start your express server!
const app = express();

/*
  The only endpoint for your server is `/graphql`- if you are fetching a resource, 
  you will need to POST your query to that endpoint. Suggestion: check out Apollo-Fetch
  or Apollo-Client. Note below where the schema and resolvers are connected. Setting graphiql
  to 'true' gives you an in-browser explorer to test your queries.
*/
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
});
