const path = require(`path`);
const slash = require(`slash`);

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  // we use the provided allContentfulBlogPost query to fetch the data from Contentful
  return graphql(
    `
      {
        allContentfulBlog {
          edges {
            node {
              id
              slug
            }
          }
        }
      }
    `,
  )
    .then((result) => {
      if (result.errors) {
        console.log('Error retrieving contentful data', result.errors);
      }

      // Resolve the paths to our template
      const blogTemplate = path.resolve('./src/templates/blog.tsx');

      // Then for each result we create a page.
      result.data.allContentfulBlog.edges.forEach((edge) => {
        const { id, slug } = edge.node;

        console.log('edge.node', edge.node);

        createPage({
          path: `/${slug}/`,
          component: slash(blogTemplate),
          context: {
            id,
          },
        });
      });
    })
    .catch((error) => {
      console.log('Error retrieving contentful data', error);
    });
};
