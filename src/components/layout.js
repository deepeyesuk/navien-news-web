import * as React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        Back to list
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Navien UK, in partnership with Deepeyes UK Ltd.
      </footer>
    </div>
  )
}

export default Layout
