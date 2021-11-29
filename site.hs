--------------------------------------------------------------------------------
{-# LANGUAGE OverloadedStrings #-}

import Data.Monoid (mappend)
import Data.Time.Calendar
import Data.Time.Clock
import Hakyll
import Text.Pandoc.Options

--------------------------------------------------------------------------------
config :: Configuration
config =
  defaultConfiguration
    { destinationDirectory = "docs"
    }

main :: IO ()
main = do
  now <- getCurrentTime
  let (year, _, _) = toGregorian $ utctDay now
  hakyllWith config $ do
    match "images/*" $ do
      route idRoute
      compile copyFileCompiler
    match "css/*" $ do
      route idRoute
      compile compressCssCompiler
    match "js/*" $ do
      route idRoute
      compile copyFileCompiler
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
      route $ setExtension "html"
      compile $
        pandocMathCompiler
          >>= loadAndApplyTemplate "templates/center.html" defaultContext
          >>= relativizeUrls
    match "cv.html" $ do
      route idRoute
      compile $
        getResourceBody
          >>= applyAsTemplate defaultContext
          >>= loadAndApplyTemplate "templates/center.html" defaultContext
          >>= relativizeUrls
    match "posts/*" $ do
      route $ setExtension "html"
      compile $
        pandocMathCompiler
          >>= loadAndApplyTemplate "templates/post.html" postCtx
          >>= relativizeUrls
    match "blog.md" $ do
      route $ setExtension "html"
      compile $ do
        posts <- recentFirst =<< loadAll "posts/*"
        let indexCtx =
              listField "posts" postCtx (return posts)
                `mappend` defaultContext
         in pandocMathCompiler
              >>= loadAndApplyTemplate "templates/blogindex.html" indexCtx
              >>= relativizeUrls
  where
    pandocMathCompiler =
      let mathExtensions = [Ext_tex_math_dollars, Ext_tex_math_double_backslash, Ext_latex_macros]
          defaultExtensions = writerExtensions defaultHakyllWriterOptions
          newExtensions = foldr enableExtension defaultExtensions mathExtensions
          writerOptions =
            defaultHakyllWriterOptions
              { writerExtensions = newExtensions,
                writerHTMLMathMethod = MathJax ""
              }
       in pandocCompilerWith defaultHakyllReaderOptions writerOptions

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
  dateField "date" "%d/%m/%Y"
    `mappend` defaultContext

listContextWith :: Context String -> String -> Context a
listContextWith ctx s = listField s ctx $ do
  identifier <- getUnderlying
  metadata <- getMetadata identifier
  let metas = maybe [] (map trim . splitAll ",") $ lookupString s metadata
  return $ map (\x -> Item (fromFilePath x) x) metas

listContext :: String -> Context a
listContext = listContextWith postCtx

tagContext = listContext "tags" <> defaultContext