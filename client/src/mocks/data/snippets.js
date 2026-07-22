export const snippets = [
  {
    id: 1,
    title: 'Fix the Sum Function',
    context: 'This function is supposed to return the sum of two numbers. Find the bug and explain why it returns wrong results.',
    code: `function add(a, b) {
  return a + b
}

const total = add(5, "10")
console.log("Total:", total)`,
    max_score: 100,
    bug_descriptions: [
      { id: 'b1', description: 'Type coercion: parameter b is passed as string "10", JavaScript coerces a to string resulting in "510" instead of 15', points: 50 },
      { id: 'b2', description: 'Missing type validation on input parameters to ensure both are numbers', points: 50 },
    ],
  },
  {
    id: 2,
    title: 'Broken Loop Condition',
    context: 'This code should print numbers 1 through 5. Identify the bug that causes unexpected behavior.',
    code: `for (let i = 1; i <= 5; i++) {
  setTimeout(() => {
    console.log(i)
  }, 100 * i)
}`,
    max_score: 100,
    bug_descriptions: [
      { id: 'b1', description: 'Closure trap: var would be function-scoped but let is block-scoped, so this actually works correctly in modern JS. The real bug is that the timeout uses 100*i causing all logs at once at 100,200,etc — should be sequential', points: 40 },
      { id: 'b2', description: 'Misuse of setTimeout in loop: all timers fire concurrently, not sequentially as might be intended', points: 30 },
      { id: 'b3', description: 'If sequential execution was intended, should use async/await or chain the timeouts', points: 30 },
    ],
  },
  {
    id: 3,
    title: 'Undefined Property Access',
    context: 'This code tries to access a nested property but throws an error. Find the bug.',
    code: `const config = {
  server: {
    host: 'localhost'
  }
}

const port = config.server.port.toString()
console.log('Port:', port)`,
    max_score: 70,
    bug_descriptions: [
      { id: 'b1', description: 'config.server.port is undefined because port property does not exist in the config object', points: 35 },
      { id: 'b2', description: 'Calling .toString() on undefined throws TypeError: Cannot read properties of undefined', points: 35 },
    ],
  },
  {
    id: 4,
    title: 'Array Mutation Bug',
    context: 'This function is supposed to remove duplicates from an array without modifying the original. Find the bug.',
    code: `function removeDuplicates(arr) {
  const result = arr
  for (let i = 0; i < result.length; i++) {
    if (result.indexOf(result[i]) !== i) {
      result.splice(i, 1)
      i--
    }
  }
  return result
}

const numbers = [1, 2, 2, 3, 4, 4, 5]
const unique = removeDuplicates(numbers)
console.log('Original:', numbers)
console.log('Unique:', unique)`,
    max_score: 100,
    bug_descriptions: [
      { id: 'b1', description: 'const result = arr creates a reference, not a copy — splice mutates the original array', points: 40 },
      { id: 'b2', description: 'After splice, i-- causes index skipping but the logic is fragile when items shift', points: 30 },
      { id: 'b3', description: 'Should use const result = [...arr] or arr.slice() to create a shallow copy', points: 30 },
    ],
  },
  {
    id: 5,
    title: 'Incorrect Async Handling',
    context: 'This function fetches user data but the caller always gets undefined. Find the bug.',
    code: `async function fetchUser(id) {
  try {
    const response = await fetch('/api/users/' + id)
    const user = await response.json()
    return user
  } catch (err) {
    console.error('Failed to fetch user:', err)
  }
}

const user = fetchUser(1)
console.log('User:', user)
user.name.toUpperCase()`,
    max_score: 90,
    bug_descriptions: [
      { id: 'b1', description: 'fetchUser returns a Promise but caller does not await it — user is a Promise object, not the resolved data', points: 35 },
      { id: 'b2', description: 'Calling .name on a Promise throws TypeError since Promise has no name property', points: 25 },
      { id: 'b3', description: 'Fix: const user = await fetchUser(1) or fetchUser(1).then(user => ...)', points: 30 },
    ],
  },
  {
    id: 6,
    title: 'Event Listener Memory Leak',
    context: 'This React-like component adds an event listener but causes a memory leak. Find the bug.',
    code: `function SearchBox() {
  const inputRef = document.getElementById('search')

  inputRef.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      performSearch(event.target.value)
    }
  })

  return '<div>Search ready</div>'
}`,
    max_score: 80,
    bug_descriptions: [
      { id: 'b1', description: 'Event listener is added every time the function runs but never removed, causing memory leak and duplicate listeners', points: 40 },
      { id: 'b2', description: 'In React, event listeners should be added in useEffect with a cleanup function that calls removeEventListener', points: 40 },
    ],
  },
  {
    id: 7,
    title: 'Incorrect Equality Check',
    context: 'This validation function incorrectly rejects valid inputs. Find the bug.',
    code: `function isValidStatus(status) {
  if (status == 'active' || status == 'inactive') {
    return true
  }
  return false
}

function updateStatus(code) {
  if (isValidStatus(0)) {
    console.log('Updating status to:', 0)
  } else {
    console.log('Invalid status')
  }
}

updateStatus(0)`,
    max_score: 70,
    bug_descriptions: [
      { id: 'b1', description: 'Using loose equality == causes type coercion: 0 == "active" is false but the check is still misleading', points: 20 },
      { id: 'b2', description: 'The value 0 is falsy, and in some contexts 0 == "" is true, creating edge-case confusion', points: 20 },
      { id: 'b3', description: 'Should use strict equality === to prevent unexpected type coercion', points: 30 },
    ],
  },
  {
    id: 8,
    title: 'Race Condition in State Update',
    context: 'This counter function has a race condition when called rapidly. Find the bug.',
    code: `let counter = 0

async function incrementCounter() {
  const current = counter
  await new Promise(resolve => setTimeout(resolve, 100))
  counter = current + 1
}

incrementCounter()
incrementCounter()
incrementCounter()

setTimeout(() => {
  console.log('Final counter:', counter)
}, 500)`,
    max_score: 100,
    bug_descriptions: [
      { id: 'b1', description: 'Race condition: all three calls read counter before any write completes — all get current=0, all set counter=1', points: 50 },
      { id: 'b2', description: 'The async delay creates a window where stale values are read — standard read-modify-write race condition', points: 30 },
      { id: 'b3', description: 'Fix: use atomic updates, mutex, or avoid async in hot paths — counter += 1 directly without await', points: 20 },
    ],
  },
]
