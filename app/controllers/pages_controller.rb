class PagesController < ApplicationController
  # ==================== REFUND SYSTEM PAGES ====================

  def farewell
    render inertia: 'Farewell'
  end

  def refund_request
    render inertia: 'RefundRequest'
  end

  def confirmation
    render inertia: 'Confirmation'
  end

  def faq
    render inertia: 'FAQ'
  end

  def status
    render inertia: 'StatusLookup', props: { zelle_paused: false }
  end

  def support
    render inertia: 'Support'
  end

  def behind_the_build
    render inertia: 'BehindTheBuild'
  end

  def donation_thank_you
    order_id = params[:orderId]

    if order_id.present?
      result = DonationProcessor.new.process(order_id)

      render inertia: 'DonationThankYou', props: {
        donor_name: result[:name],
        amount: result[:amount],
        processed: result[:success]
      }
    else
      render inertia: 'DonationThankYou'
    end
  end

  def artist_payments
    render inertia: 'ArtistPayments'
  end

  def albir_payment_record
    @og_title = "NeoKiz 2022 Payment Record — Charles Ogar"
    @meta_description = "A documented public record of the NeoKiz 2022 artist payment timeline, with receipts and evidence."
    @og_image = "/images/og-default.png"
    render inertia: 'AlbirPaymentRecord'
  end

  def choosing_myself
    @og_title = "Choosing Myself — Neo Kizomba Festival"
    @meta_description = "The full story behind the end of Neo Kizomba Festival. 10 years of building, what it cost, and why I'm choosing myself."
    @og_image = "/images/choosing-myself/hero.jpg"
    render inertia: 'ChoosingMyself'
  end

  # Note: progress action moved to RefundProgressController for Notion integration

  # ==================== LEGACY FESTIVAL PAGES ====================

  def home
    featured_artists = DataService.artists.sample(6)
    latest_videos = DataService.videos.last(3)

    render inertia: 'Home', props: {
      featured_artists: featured_artists,
      latest_videos: latest_videos
    }
  end

  def test
    render inertia: 'Test'
  end

  def inertia_example
    render inertia: 'InertiaExample', props: {
      name: 'Neokizfest Developer'
    }
  end

  def lineup
    artists = DataService.artists

    render inertia: 'Lineup', props: {
      artists: artists
    }
  end

  def videos
    videos = DataService.videos

    render inertia: 'Videos', props: {
      videos: videos
    }
  end

  def testimonials
    testimonials = DataService.testimonials

    render inertia: 'Testimonials', props: {
      testimonials: testimonials
    }
  end
end
