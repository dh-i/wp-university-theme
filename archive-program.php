<?php get_header();
pageBanner(array(
    'title' => 'All Programs',
    'subtitle' => 'There is something for everyone. Have a look around.'
));
?>

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