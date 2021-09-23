--------------------------------------------------------------------------------
{-# LANGUAGE OverloadedStrings #-}

import Data.Monoid (mappend)
import Data.Time.Calendar
import Data.Time.Clock
import Hakyll

--------------------------------------------------------------------------------
main :: IO ()
main = do
  now <- getCurrentTime
  let (year, _, _) = toGregorian $ utctDay now
  hakyll $ do
    match "images/*" $ do
      route idRoute
      compile copyFileCompiler
    match "css/*" $ do
      route idRoute
      compile compressCssCompiler
    match "templates/*" $ compile templateBodyCompiler
    match "index.html" $ do
      route idRoute
      compile $ do
        let ctx = constField "year" (show year) `mappend` defaultContext
         in getResourceBody
              >>= applyAsTemplate ctx
              >>= loadAndApplyTemplate "templates/index.html" ctx
              >>= relativizeUrls
    match "about.md" $ do
      route   $ setExtension "html"
      compile $ pandocCompiler 
        >>= loadAndApplyTemplate "templates/center.html" defaultContext 
        >>= relativizeUrls
    match "cv.html" $ do
      route idRoute 
      compile $ getResourceBody 
        >>= applyAsTemplate defaultContext
        >>= loadAndApplyTemplate "templates/center.html" defaultContext
        >>= relativizeUrls
    match "blog.md" $ do
      route   $ setExtension "html"
      compile $ pandocCompiler 
        >>= loadAndApplyTemplate "templates/blogindex.html" defaultContext
        >>= relativizeUrls

{-
main :: IO ()
main = hakyll $ do
    match "images/*" $ do
        route   idRoute
        compile copyFileCompiler

    match "css/*" $ do
        route   idRoute
        compile compressCssCompiler

    match (fromList ["about.rst", "contact.markdown"]) $ do
        route   $ setExtension "html"
        compile $ pandocCompiler
            >>= loadAndApplyTemplate "templates/default.html" defaultContext
            >>= relativizeUrls

    match "posts/*" $ do
        route $ setExtension "html"
        compile $ pandocCompiler
            >>= loadAndApplyTemplate "templates/post.html"    postCtx
            >>= loadAndApplyTemplate "templates/default.html" postCtx
            >>= relativizeUrls

    create ["archive.html"] $ do
        route idRoute
        compile $ do
            posts <- recentFirst =<< loadAll "posts/*"
            let archiveCtx =
                    listField "posts" postCtx (return posts) `mappend`
                    constField "title" "Archives"            `mappend`
                    defaultContext

            makeItem ""
                >>= loadAndApplyTemplate "templates/archive.html" archiveCtx
                >>= loadAndApplyTemplate "templates/default.html" archiveCtx
                >>= relativizeUrls

    match "index.html" $ do
        route idRoute
        compile $ do
            posts <- recentFirst =<< loadAll "posts/*"
            let indexCtx =
                    listField "posts" postCtx (return posts) `mappend`
                    defaultContext

            getResourceBody
                >>= applyAsTemplate indexCtx
                >>= loadAndApplyTemplate "templates/default.html" indexCtx
                >>= relativizeUrls

    match "templates/*" $ compile templateBodyCompiler

-}
--------------------------------------------------------------------------------
postCtx :: Context String
postCtx =
  dateField "date" "%B %e, %Y"
    `mappend` defaultContext
