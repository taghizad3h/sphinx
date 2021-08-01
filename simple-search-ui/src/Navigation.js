import React, { useState } from "react";

import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

const Navigation = (props) => {
  return (
    <Navbar bg="light" variant="light"  >
      <Navbar.Brand href="/">Search UI for Testing</Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav" className="mr-auto ml-auto">
        <NavDropdown
          className="ml-auto"
          title={props.selectedIndex}
          id="basic-nav-dropdown"
        >
          {props.indexNames &&
            props.indexNames.map((item, id) => {
              return <NavDropdown.Item as="button" onClick={e=>props.handleSelectedIndexName(e.target.outerText)} key={id}>{item}</NavDropdown.Item>;
            })}
        </NavDropdown>

        <Form
          inline
          onSubmit={(e) => {
            e.preventDefault();
            props.queryHanlder();
          }}
        >
          <FormControl
            type="text"
            placeholder="search"
            value={props.query}
            onChange={(e) => props.setQuery(e.target.value)}
          />
          <Button type="submit" variant="outline-dark">
            {" "}
            Search{" "}
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
