import { useEffect, useState, useCallback } from "react";

const useData = (query, github) => {
  let [userName, setUserName] = useState("");
  let [repoList, setRepoList] = useState(null);
  let [pageCount, setPageCount] = useState(10);
  let [queryString, setQueryString] = useState("");
  let [totalCount, setTotalCount] = useState(null);

  let [startCursor, setStartCursor] = useState(null);
  let [endCursor, setEndCursor] = useState(null);
  let [hasPreviousPage, setHasPreviousPage] = useState(false);
  let [hasNextPage, setHasNextPage] = useState(true);
  let [paginationKeyword, setPaginationKeyword] = useState("first");
  let [paginationString, setPaginationString] = useState("");

  const fetchData = useCallback(() => {
    const queryText = JSON.stringify(
      query(pageCount, queryString, paginationKeyword, paginationString)
    );

    fetch(github.baseURL, {
      method: "POST",
      headers: github.headers,
      body: queryText,
    })
      .then((response) => response.json())
      .then((data) => {
        const {viewer, search} = data?.data;
        const repos = search.edges;
        const total = search.repositoryCount;
        const start = search.pageInfo?.startCursor;
        const end = search.pageInfo?.endCursor;
        const next = search.pageInfo?.hasNextPage;
        const prev = search.pageInfo?.hasPreviousPage;

        setUserName(viewer.name);
        setRepoList(repos);
        setTotalCount(total);

        setStartCursor(start);
        setEndCursor(end);
        setHasNextPage(next);
        setHasPreviousPage(prev);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [pageCount, queryString, paginationString, paginationKeyword, github, query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [
    userName,
    totalCount,
    pageCount,
    repoList,
    setPageCount,
    queryString,
    setQueryString,
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
    setPaginationKeyword,
    setPaginationString
  ];
}

export default useData;