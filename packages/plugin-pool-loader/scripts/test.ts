import execa from 'execa'
;(async () => {
  const testServer = execa('hs')
  testServer.stdout.pipe(process.stdout);
  setTimeout(() => {
    testServer.kill()
  }, 3000)
  //=> 'unicorns'
})()
