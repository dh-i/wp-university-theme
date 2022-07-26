<?php get_header();
?>

<div class="page-banner">
    <div class="page-banner__bg-image" style="background-image: url(<?php echo get_theme_file_uri("images/ocean.jpg"); ?>)"></div>
    <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title">All Programs</h1>
        <div class="page-banner__intro">
            <p>There is something for everyone. Have a look around</p>

        </div>
    </div>
</div>

<div class="container container--narrow page-section">
    <ul class="link-list min-list">
        <?php

        while (have_posts()) {

            the_post();
        ?>

            <li><a href="<?php the_permalink() ?>"><?php the_title() ?></a></li>

        <?php }
        echo paginate_links();
        ?>
    </ul>

    <hr class="section-break">
    <p>Looking for a recap of past events? <a href="<?php echo site_url('/past-events') ?>">Check out our past events archive.</a></p>
</div>

<?php
get_footer();
?>