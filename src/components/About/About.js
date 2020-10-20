import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';
import {
    containerVariants,
    scaleXVariants,
    variantsProps
} from '../../shared/utility';

const About = () => {
    return (
        <motion.div
            variants={containerVariants}
            {...variantsProps}
        >
            <motion.div
                className={styles.about}
                variants={scaleXVariants}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 319">
                    <path
                        fill="#fff"
                        fillOpacity="1"
                        d="M0,128L80,117.3C160,107,320,85,480,101.3C640,117,800,171,960,170.7C1120,171,1280,117,1360,90.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
                        data-darkreader-inline-fill=""
                        style={{ "--darkreader-inline-fill": "#007acc;" }}
                    >
                    </path>
                </svg>
                <motion.div
                    variants={scaleXVariants}
                >
                    <h2>Welcome!</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit praesentium est et amet fuga in maiores dolore doloribus, asperiores aliquam ut dolores molestias nam aliquid, at laboriosam hic tempore numquam vel ipsum sunt, reprehenderit cupiditate ab? Obcaecati nostrum velit praesentium amet in eos natus voluptate recusandae mollitia quaerat? Iusto earum ducimus deserunt id sed corporis sapiente quod dolorum cumque in? Aperiam quis cum, possimus aliquam iure ipsa! Voluptatem nihil deleniti veniam rerum dolor ducimus eius vero aut mollitia ex aliquid asperiores, ea non recusandae eligendi doloremque magnam numquam aperiam porro! Dicta quisquam ab neque mollitia molestiae repudiandae at nostrum esse?
                    </p>
                    <h3>Something about our passionate approach to making burgers</h3>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus quasi accusantium modi id nemo aliquid nisi ea nihil voluptatem facilis, similique, voluptatum rem explicabo veniam voluptatibus voluptate ab repellendus sequi ipsa sint assumenda debitis? Similique ducimus velit placeat sapiente nostrum excepturi odio libero soluta maiores sint officia quo distinctio aliquam, at ut laborum accusamus tempora dolorem quos, eos ab aut itaque tenetur. Soluta cumque necessitatibus, sequi asperiores magnam unde rem repellat explicabo natus ea eligendi, quae odit eius animi quis! Culpa voluptatem neque animi officia nihil accusantium expedita vitae qui explicabo sit sed molestias, ex sequi dolorum commodi numquam? Laborum.
                    </p>
                    <h3>Something about tradition passed down from generation to generation</h3>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos animi, reiciendis sapiente aliquam numquam autem adipisci praesentium sed eaque perferendis expedita voluptatem dolorem consectetur vero magni, fuga facere ipsam, eos tempora neque et voluptas enim perspiciatis. Officia in voluptate deleniti atque! Qui repellendus beatae laboriosam dignissimos cupiditate! Dolorem culpa hic saepe odit? Nesciunt sapiente, similique dicta modi amet esse nihil repudiandae ducimus, minima nemo praesentium corrupti laudantium vel velit, nobis dolore accusamus facilis nulla sed eaque hic voluptates obcaecati! Incidunt laudantium reprehenderit libero sed quas cupiditate, maxime fugiat vitae sit, neque aliquam. Perferendis earum officiis molestias architecto voluptate aut tempore?
                    </p>
                    <h3>Something about our crew, consisting only of highly skilled, work-oriented individuals</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur sunt debitis dignissimos, iusto quia voluptate est voluptas? Facilis expedita deleniti nisi nemo architecto possimus quibusdam earum, adipisci officiis reiciendis necessitatibus eos ut fuga aperiam laborum ex ipsa eveniet perspiciatis error suscipit quasi nulla? Quam eligendi totam ipsum laborum, praesentium assumenda cum ullam corrupti aperiam nam consequatur, maiores nostrum enim necessitatibus consequuntur odio? Quis error quo hic qui quas quia at, porro possimus explicabo, deleniti, ea nesciunt! Cupiditate illum ducimus inventore non aliquam, voluptates blanditiis est deserunt ex ab rerum enim veniam asperiores molestias rem praesentium nihil doloribus omnis, labore numquam?
                    </p>
                    <h3>Something extra that will convince hesitant customers to choose our services</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium nam recusandae ex autem exercitationem tempora quos. Deserunt asperiores delectus, quos ad voluptates exercitationem earum laboriosam, soluta perferendis magni ab, quisquam laudantium consectetur! Veniam, laboriosam voluptate quaerat voluptas incidunt est ipsam alias maiores doloremque atque explicabo corrupti repellendus, natus eum eligendi quis. Dolor quidem eveniet nostrum fuga distinctio in vel! Deserunt, hic, eius omnis rem quaerat, reiciendis quas ducimus odio expedita minus ipsam nihil! Nisi quasi commodi nam sapiente quisquam iste repellat similique voluptas harum, nihil autem molestiae esse nulla quam assumenda, ad modi! Similique, placeat molestiae! Enim placeat excepturi ullam!
                    </p>
                </motion.div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 319">
                    <path
                        fill="#fff"
                        fillOpacity="1"
                        d="M0,128L80,117.3C160,107,320,85,480,101.3C640,117,800,171,960,170.7C1120,171,1280,117,1360,90.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                        data-darkreader-inline-fill=""
                        style={{ "--darkreader-inline-fill": "#007acc;" }}
                    >
                    </path>
                </svg>
            </motion.div>
        </motion.div>
    );
}

export default About;