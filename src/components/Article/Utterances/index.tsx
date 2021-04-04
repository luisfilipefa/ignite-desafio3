import { Component, useEffect } from 'react';
import commonStyles from '../../../styles/common.module.scss';

export default class Utterances extends Component {
  componentDidMount () {
    let script = document.createElement("script");
    let anchor = document.getElementById("inject-comments-for-uterances");
    script.setAttribute("src", "https://utteranc.es/client.js");
    script.setAttribute("crossorigin","anonymous");
    script.setAttribute("async", 'true');
    script.setAttribute("repo", "luisfilipefa/ignite-desafio3.1");
    script.setAttribute("issue-term", "url");
    script.setAttribute( "theme", "github-dark");
    anchor.appendChild(script);
  }

  render() {
    return (
        <div id="inject-comments-for-uterances" className={commonStyles.container}></div>
    );
  }
}
