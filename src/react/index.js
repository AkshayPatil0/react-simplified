import Dispatcher from "./dispatcher";
import { useState, createElement } from "./React";

const __SharedInternals__ = {
  Dispatcher,
};

const React = {
  useState,
  createElement,
  __SharedInternals__,
};

export default React;
