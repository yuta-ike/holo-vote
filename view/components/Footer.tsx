import React, { Fragment, useState } from 'react'
import { useGlobalStates } from '../../utils/context/GlobalStatesProvider'
import useIsSp from '../../utils/hooks/useIsSp'

const Footer = () => {
  const { globalStates: { initialized, footerMessage } } = useGlobalStates()
  const [open, setOpen] = useState(false)
  const isSp = useIsSp()
  return (
    <div className="mt-12 px-4 py-8 text-gray-500 bg-white sm:shadow-lg w-screen flex flex-col items-center">
      <div className="max-w-full sm:mx-8 box-border">
        { isSp && <button className="mr-auto" onClick={() => setOpen(!open)}>{"> サービスについて"}</button> }
        {
          initialized && (isSp && open || !isSp) &&
          Object.entries(footerMessage).map(([key, value]) => (
            <dl key={key} className="mt-2">
              <dt className="font-bold">{key}</dt>
              <dd>{
                value.split(/%TWITTER_ACCOUNT%/).map((str, i) => (
                  <Fragment key={i}>
                    {i !== 0 && <a className="underline text-blue-500" href="https://twitter.com/holovote">@holovote</a>}
                    {str}
                  </Fragment>
                ))
              }</dd>
            </dl>
          ))
        }
      </div>
    </div>
  )
}

export default Footer
