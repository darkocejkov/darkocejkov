import {Octokit} from "@octokit/core";

const octokit = new Octokit({auth: process.env.REACT_APP_GITHUB_PAT});
// const queryClient = new QueryClient()

export const rootContents = async () => {
    return octokit.request('GET /repos/{owner}/{repo}/contents/', {
        owner: 'darkocejkov',
        repo: 'knowledge',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
}

export async function treeContents(path: string = '') {

    let split = path ? path.split('/contents/')[1] : ''
    let cleaned = split ? split.slice(0, split.search(/\?ref=main/)) : ''

    // https://github.com/octokit/octokit.js/

    return await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: 'darkocejkov',
        repo: 'knowledge',
        path: cleaned,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
}

export async function repoContents(path: string = '') {

    console.log(`[repoContents]: `, {path})

    return await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: 'darkocejkov',
        repo: 'knowledge',
        path,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
}

