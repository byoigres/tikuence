import React from 'react'
import { InertiaLink } from '@inertiajs/inertia-react'

const Test = ({ date }) => (
  <>
    <h1>{`The current date is ${date}`}</h1>
    <InertiaLink href="/inertia">Go to Example page</InertiaLink>
  </>
)

export default Test
