import styles from "./Pricing.module.css";
import { Section, SectionHeader, Grid, Col, Card, Button, Tag } from "@/components/ui";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

export function Pricing() {
  const { pricing } = site;
  return (
    <Section id={pricing.meta.id} bg="alt">
      <SectionHeader eyebrow={pricing.meta.eyebrow} title={pricing.meta.title} intro={pricing.meta.intro} />
      <Grid>
        {pricing.plans.map((plan) => (
          <Col key={plan.id} span={12} md={4}>
            <Card raised className={cn(styles.plan, plan.highlighted && styles.featured)}>
              {plan.highlighted ? <Tag className={styles.badge}>más elegido</Tag> : null}
              <div className={styles.head}>
                <h3 className={styles.name}>{plan.name}</h3>
                <span className={styles.nick}>“{plan.nickname}”</span>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.price}>{plan.price}</span>
                <span className={styles.note}>{plan.note}</span>
              </div>
              <p className={styles.desc}>{plan.description}</p>
              <ul className={styles.features}>
                {plan.features.map((feature) => (
                  <li key={feature} className={styles.feature}>
                    <span className={styles.check}>+1</span> {feature}
                  </li>
                ))}
              </ul>
              <Button href={plan.cta.href} variant={plan.highlighted ? "accent" : "outline"} className={styles.cta}>
                {plan.cta.label}
              </Button>
            </Card>
          </Col>
        ))}
      </Grid>
    </Section>
  );
}
